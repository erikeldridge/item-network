require 'rubygems'
require 'sequel'

Sequel.migration do
  change do

    create_table :tags do
      primary_key :id
      String :text
      foreign_key :item_id, :items, :key => :id
      foreign_key :owner_id, :users, :key => :id
    end

    create_table :items do
      primary_key :id
      String :name
      foreign_key :owner_id, :users, :key => :id
    end

    create_table :comments do
      primary_key :id
      String :text
      foreign_key :owner_id, :users, :key => :id
      foreign_key :item_id, :items, :key => :id
    end

    create_table :activities do
      primary_key :id
      String :table
      Integer :row
      String :action
      foreign_key :owner_id, :users, :key => :id
    end

    create_table :users do
      primary_key :id
      String :name
    end

    self[:users].insert({:name => 'user1'})
    self[:users].insert({:name => 'user2'})
    self[:users].insert({:name => 'user3'})

    self[:items].insert({:owner_id => 1, :name => 'item1'})
    self[:items].insert({:owner_id => 2, :name => 'item2'})
    self[:items].insert({:owner_id => 3, :name => 'item2'})

    self[:tags].insert({:owner_id => 1, :item_id => 1, :text => 'a'})
    self[:tags].insert({:owner_id => 1, :item_id => 2, :text => 'b'})
    self[:tags].insert({:owner_id => 1, :item_id => 3, :text => 'c'})

    self[:comments].insert({:owner_id => 1, :item_id => 1, :text => 'a comment'})
    self[:comments].insert({:owner_id => 2, :item_id => 2, :text => 'another comment'})
    self[:comments].insert({:owner_id => 2, :item_id => 3, :text => 'a third comment'})
  end
end
