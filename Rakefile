require "sequel"

# Ref: http://obfuscurity.com/2011/11/Sequel-Migrations-on-Heroku
namespace :db do

  Sequel.extension :migration
  DB = Sequel.connect(ENV['HEROKU_POSTGRESQL_RED_URL'] || 'sqlite://sqlite.db')

  desc "Perform migration reset (full erase and migration up)"
  task :reset do
    Sequel::Migrator.run(DB, "migrations", :target => 0)
    Sequel::Migrator.run(DB, "migrations")
    puts "<= sq:migrate:reset executed"
  end

  desc "Perform migration up to latest migration available"
  task :up do
    Sequel::Migrator.run(DB, "migrations")
    puts "<= sq:migrate:up executed"
  end

  desc "Perform migration down (erase all data)"
  task :down do
    Sequel::Migrator.run(DB, "migrations", :target => 0)
    puts "<= sq:migrate:down executed"
  end

  desc "List tables"
  task :tables do
    # Ref: http://sequel.rubyforge.org/rdoc/classes/Sequel/Database.html#method-i-tables
    puts DB.tables
  end
end

task :default => ['db:up']
