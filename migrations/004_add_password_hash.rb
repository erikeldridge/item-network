require 'rubygems'
require 'sequel'
require 'scrypt'

Sequel.migration do

  up do
    alter_table :users do
      add_column :password_hash, String
      add_column :email, String
    end

    # https://github.com/emerose/pbkdf2-ruby
    password = SCrypt::Password.create("asd123")

    self[:users].filter({:id => 1}).update({:password_hash => password, :email => 'a@s.d'})
    self[:users].filter({:id => 2}).update({:password_hash => password, :email => 'q@w.e'})
  end

  down do
    alter_table :users do
      drop_column :password_hash
      drop_column :email
    end
  end
end
