require "sequel"

# Ref: http://obfuscurity.com/2011/11/Sequel-Migrations-on-Heroku
namespace :db do

  Sequel.extension :migration
  DB = Sequel.connect(ENV['HEROKU_POSTGRESQL_RED_URL'] || 'sqlite://sqlite.db')

  desc "Perform migration"
  task :migrate do
    Sequel::Migrator.run(DB, "migrations")
    puts ":)"
  end

  desc "Reset DB"
  task :reset do
    Sequel::Migrator.run(DB, "migrations", :target => 0)
    Sequel::Migrator.run(DB, "migrations")
    puts ':)'
  end

  desc "List tables"
  task :tables do
    # Ref: http://sequel.rubyforge.org/rdoc/classes/Sequel/Database.html#method-i-tables
    puts DB.tables
  end
end

task :default => ['db:migrate']
