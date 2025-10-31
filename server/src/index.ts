import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod'; // For validation

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Enable JSON body parsing

app.get('/experiences', async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let whereClause = {}; // Default: no filter
    if (search && typeof search === 'string') {
      // If a search query exists, build a where clause
      // This will search in both the 'title' and 'location' fields
      whereClause = {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive', // Case-insensitive
            },
          },
          {
            location: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    // Pass the whereClause to Prisma
    const experiences = await prisma.experience.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc', //show newest first
      },
    });
    
    console.log(`GET /experiences: Found ${experiences.length} experiences for query "${search || ''}"`);
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

/*
 * GET /experiences/:id
 * Returns details for one experience, including available slots.
 */
app.get('/experiences/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid experience id' });
  }
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: id },
      include: {
        slots: {
          where: { isAvailable: true }, // Only show available slots
          orderBy: { startTime: 'asc' },
        },
      },
    });
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experience details' });
  }
});

/*
 * POST /promo/validate
 * Validates a promo code.
 */
const promoSchema = z.object({
  code: z.string().min(1),
});

app.post('/promo/validate', async (req: Request, res: Response) => {
  try {
    const { code } = promoSchema.parse(req.body);
    const promo = await prisma.promoCode.findUnique({
      where: { code, isActive: true },
    });
    if (!promo) {
      return res.status(404).json({ error: 'Invalid or expired promo code' });
    }
    res.json(promo);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

/*
 * POST /bookings
 * Creates a new booking and marks a slot as unavailable.
 * This uses a transaction to prevent double-booking.
 */
const bookingSchema = z.object({
  slotId: z.string().cuid(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  promoCode: z.string().optional(),
  finalPrice: z.number().min(0),
});

app.post('/bookings', async (req:Request, res: Response) => {
  try {
    const bookingData = bookingSchema.parse(req.body);

    // Use a transaction to make sure the slot is still available
    // when we book it. This prevents a "race condition"
    // where two people book the same slot at the same time.
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find the slot and lock it
      const slot = await tx.slot.findUnique({
        where: { id: bookingData.slotId },
      });

      // 2. Check if it's still available
      if (!slot || !slot.isAvailable) {
        throw new Error('Slot is no longer available');
      }

      // 3. Mark the slot as unavailable
      await tx.slot.update({
        where: { id: bookingData.slotId },
        data: { isAvailable: false },
      });

      // 4. Create the booking
      const newBooking = await tx.booking.create({
        data: {
          slotId: bookingData.slotId,
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          promoCode: bookingData.promoCode ?? null,
          finalPrice: bookingData.finalPrice,
        },
      });

      return newBooking;
    });

    // If transaction is successful:
    res.status(201).json({ success: true, booking: result });

  } catch (error: any) {
    if (error.message === 'Slot is no longer available') {
      return res.status(409).json({ error: 'Slot is no longer available' }); // 409 Conflict
    }
    res.status(400).json({ error: 'Booking failed', details: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});