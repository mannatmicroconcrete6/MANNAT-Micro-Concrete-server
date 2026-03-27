const supabase = require('./supabaseClient');

async function seedPlasterProject() {
    console.log('Seeding Plaster project...');
    const projectData = {
        title: 'Luxury Venetian Plaster Residence',
        description: 'A high-end residential project featuring authentic Venetian Lime Plaster on all vertical surfaces. The texture provides a deep, marble-like finish with a soft natural sheen.',
        category: 'Venetian Lime Plaster', // Match database constraint
        location: 'South Delhi',
        area: '2500 sq.ft',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1621293954908-907159247fc8',
                public_id: 'plaster_1'
            }
        ],
        featured: true,
        created_at: new Date()
    };

    const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

    if (error) {
        console.error('Error seeding project:', error);
    } else {
        console.log('Successfully seeded Plaster project:', data);
    }
}

seedPlasterProject();
