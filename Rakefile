require "sequel"

# Credit: http://obfuscurity.com/2011/11/Sequel-Migrations-on-Heroku
namespace :db do

  Sequel.extension :migration
  DB = Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://sqlite.db')

  desc "Perform migration"
  task :migrate do
    Sequel::Migrator.run(DB, "migrations")
    puts ":)"
  end

  desc "List tables"
  task :tables do
    # http://sequel.rubyforge.org/rdoc/classes/Sequel/Database.html#method-i-tables
    puts DB.tables
  end
end

task :default => ['db:migrate']
