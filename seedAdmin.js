const supabase = require('./supabaseClient');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        console.log('🌱 Seeding Admin User...');

        const username = 'admin';
        const rawPassword = 'mannat_secure_password';

        // Check if admin exists
        const { data: existingAdmin, error: findError } = await supabase
            .from('admins')
            .select('*')
            .eq('username', username)
            .single();

        if (existingAdmin) {
            console.log('⚠️ Admin user already exists');
            process.exit();
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(rawPassword, 12);

        // Create admin
        const { data: newAdmin, error: insertError } = await supabase
            .from('admins')
            .insert([
                {
                    username: username,
                    password: hashedPassword,
                    role: 'admin'
                }
            ])
            .select()
            .single();

        if (insertError) {
            throw insertError;
        }

        console.log('🎉 Admin user created successfully!');
        console.log(`Username: ${username}`);
        console.log(`Password: ${rawPassword}`);
        process.exit();

    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
