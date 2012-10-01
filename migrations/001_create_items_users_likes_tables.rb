require 'rubygems'
require 'sequel'

Sequel.migration do
  change do
    create_table :likes do
      primary_key :id
      foreign_key :item_id, :items, :key => :id
      foreign_key :owner_id, :users, :key => :id
    end

    create_table :items do
      primary_key :id
      String :name
      foreign_key :created_by_id, :users, :key => :id
    end

    create_table :users do
      primary_key :id
      String :name
    end

    self[:users].insert({:name => 'user1'})
    self[:users].insert({:name => 'user2'})
    self[:users].insert({:name => 'user3'})

    self[:items].insert({:name => 'item1'})
    self[:items].insert({:name => 'item2'})
    self[:items].insert({:name => 'item2'})

    self[:likes].insert({:owner_id => 1, :item_id => 1})
    self[:likes].insert({:owner_id => 2, :item_id => 2})
    self[:likes].insert({:owner_id => 3, :item_id => 3})
  end
end
