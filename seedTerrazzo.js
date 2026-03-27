const supabase = require('./supabaseClient');

async function seedTerrazzoProject() {
    console.log('Seeding Terrazzo project...');
    const projectData = {
        title: 'Venetian Terrazzo Showroom',
        description: 'A premium retail showroom featuring custom Venetian Terrazzo floors with marble aggregates. The surface is polished to a glass-like finish, offering durability and timeless elegance.',
        category: 'Terrazzo',
        location: 'Mumbai, BKC',
        area: '1800 sq.ft',
        images: [
            {
                url: 'https://plus.unsplash.com/premium_photo-1678447323507-aeae3b4ee525',
                public_id: 'terrazzo_1'
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
        console.log('Successfully seeded Terrazzo project:', data);
    }
}

seedTerrazzoProject();
