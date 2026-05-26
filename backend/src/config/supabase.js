const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY // service_role pour le backend

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables SUPABASE_URL et SUPABASE_SERVICE_KEY manquantes dans .env')
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase   