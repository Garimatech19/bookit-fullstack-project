import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const data = [
    {
        name: "Skydiving Adventure",
        location: "Dubai, UAE",
        description: "Experience the thrill of free-falling from 13,000 feet with stunning views of Palm Jumeirah.",
        image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92",
        price: 499,
        dates: ["2025-11-10", "2025-11-17", "2025-11-24"],
        slots: [
            { time: "09:00 AM", available: 5 },
            { time: "11:00 AM", available: 3 },
            { time: "01:00 PM", available: 4 }
        ],
    },
    {
        name: "Desert Safari Ride",
        location: "Rajasthan, India",
        description: "Explore the golden dunes on a thrilling desert safari with camel rides and cultural shows.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        price: 150,
        dates: ["2025-12-05", "2025-12-10", "2025-12-20"],
        slots: [
            { time: "04:00 PM", available: 10 },
            { time: "06:00 PM", available: 7 }
        ],
    },
    {
        name: "Scuba Diving Experience",
        location: "Goa, India",
        description: "Dive into the clear blue waters of the Arabian Sea and explore vibrant coral reefs.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        price: 250,
        dates: ["2025-11-15", "2025-11-22", "2025-11-29"],
        slots: [
            { time: "08:00 AM", available: 6 },
            { time: "10:00 AM", available: 8 }
        ],
    },
    {
        name: "Hot Air Balloon Ride",
        location: "Cappadocia, Turkey",
        description: "Float over the fairy chimneys and unique landscapes of Cappadocia during sunrise.",
        image: "https://images.unsplash.com/photo-1645221559842-5a542abbb40b",
        price: 300,
        dates: ["2025-11-18", "2025-11-25", "2025-12-02"],
        slots: [
            { time: "06:00 AM", available: 12 },
            { time: "07:30 AM", available: 10 }
        ],
    },
    {
        name: "Paragliding Experience",
        location: "Bir Billing, India",
        description: "Soar over the Himalayas and feel the wind beneath your wings in this paragliding hotspot.",
        image: "https://images.unsplash.com/photo-1645221559842-5a542abbb40b",
        price: 180,
        dates: ["2025-11-12", "2025-11-19", "2025-11-26"],
        slots: [
            { time: "10:00 AM", available: 8 },
            { time: "12:00 PM", available: 6 }
        ],
    },
    {
        name: "Trekking to Triund",
        location: "Himachal Pradesh, India",
        description: "Enjoy a scenic trek through pine forests and panoramic mountain views of the Dhauladhar range.",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        price: 120,
        dates: ["2025-11-08", "2025-11-15", "2025-11-22"],
        slots: [
            { time: "06:00 AM", available: 15 },
            { time: "08:00 AM", available: 10 }
        ],
    },
    {
        name: "River Rafting",
        location: "Rishikesh, India",
        description: "Conquer the rapids of the Ganges with professional rafting guides.",
        image: "https://images.unsplash.com/photo-1627241129356-137242cf14f0",
        price: 100,
        dates: ["2025-11-05", "2025-11-12", "2025-11-19"],
        slots: [
            { time: "09:00 AM", available: 12 },
            { time: "11:00 AM", available: 9 }
        ],
    },
    {
        name: "Scenic Helicopter Tour",
        location: "New York City, USA",
        description: "Fly over Manhattan’s skyline and enjoy aerial views of the Statue of Liberty and Central Park.",
        image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
        price: 550,
        dates: ["2025-11-20", "2025-11-27", "2025-12-04"],
        slots: [
            { time: "10:00 AM", available: 5 },
            { time: "02:00 PM", available: 4 }
        ],
    },
    {
        name: "Jungle Safari Experience",
        location: "Jim Corbett, India",
        description: "Witness exotic wildlife and lush greenery in India's oldest national park.",
        image: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6",
        price: 220,
        dates: ["2025-11-09", "2025-11-16", "2025-11-23"],
        slots: [
            { time: "07:00 AM", available: 10 },
            { time: "04:00 PM", available: 8 }
        ],
    }
];

function parseTime(timeStr: string) {
    const [time, modifier] = timeStr.split(' ');
    let hours = 0, minutes = 0;
    if (time) {
        const [h = 0, m = 0] = time.split(':').map(Number);
        hours = h;
        minutes = m;
    }

    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
        hours = 0; // Midnight case
    }
    return { hours, minutes };
}


async function main() {
  console.log('Start seeding ...');
  for (const exp of data) {
    const slotsToCreate = [];
    // Loop over each date for this experience
    for (const date of exp.dates) {
        // Loop over each time slot for that date
        for (const slot of exp.slots) {

            // Combine date and time into a full Date object
            const { hours, minutes } = parseTime(slot.time);
            
            // Create the startTime as a UTC Date object
            const startTime = new Date(date);
            startTime.setUTCHours(hours, minutes, 0, 0);

            // Create an endTime (assuming a 2-hour duration)
            const endTime = new Date(startTime);
            endTime.setUTCHours(startTime.getUTCHours() + 2);

            for (let i = 0; i < slot.available; i++) {
                slotsToCreate.push({
                    startTime: startTime,
                    endTime: endTime,
                    // isAvailable is true by default
                });
            }
        }
    }

    // create the Experience and all its Slots in one transaction
    await prisma.experience.create({
        data: {
            title: exp.name,
            description: exp.description,
            location: exp.location,
            price: exp.price,
            imageUrl: exp.image,
            slots: {
                create: slotsToCreate, // Prisma's nested create feature
            },
        },
    });
    console.log(`Created experience: ${exp.name} with ${slotsToCreate.length} slots`);
  }

  //Create the promo codes
  console.log('Creating promo codes...');
  await prisma.promoCode.createMany({
    data: [
      { code: 'SAVE10', discount: 10, isPercent: false },
      { code: 'FLAT100', discount: 100, isPercent: false },
    ],
  });
  console.log('Promo codes created.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    (globalThis as any).process?.exit?.(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });