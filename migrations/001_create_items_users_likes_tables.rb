require 'rubygems'
require 'sequel'

Sequel.migration do
  change do

    create_table :items do
      primary_key :id
      String :name
      foreign_key :owner_id, :users, :key => :id
      timestamp :created_at
      timestamp :updated_at
    end

    create_table :comments do
      primary_key :id
      String :text
      foreign_key :owner_id, :users, :key => :id
      timestamp :created_at
      timestamp :updated_at
    end

    create_table :users do
      primary_key :id
      String :name
      timestamp :created_at
      timestamp :updated_at
    end

    # item mentioned in comment
    create_table :item_mentions do
      primary_key :id
      foreign_key :comment_id, :comments, :key => :id
      foreign_key :item_id, :items, :key => :id
      foreign_key :owner_id, :users, :key => :id
      timestamp :created_at
      timestamp :updated_at
    end

    create_table :user_likes do
      primary_key :id
      foreign_key :user_id, :users, :key => :id
      foreign_key :owner_id, :users, :key => :id
      timestamp :created_at
      timestamp :updated_at
    end

    create_table :activities do
      primary_key :id
      String :table
      Integer :row
      String :action
      foreign_key :owner_id, :users, :key => :id
      timestamp :created_at
      timestamp :updated_at
    end



    self[:users].insert({:name => 'user1', :created_at => Time.now})
    self[:users].insert({:name => 'user2', :created_at => Time.now})
    self[:users].insert({:name => 'user3', :created_at => Time.now})

    self[:items].insert({:owner_id => 1, :name => 'item1', :created_at => Time.now})
    self[:items].insert({:owner_id => 2, :name => 'item2', :created_at => Time.now})
    self[:items].insert({:owner_id => 3, :name => 'item3', :created_at => Time.now})

    self[:user_likes].insert({:owner_id => 1, :user_id => 2, :created_at => Time.now})

    self[:comments].insert({:owner_id => 1, :text => 'a comment', :created_at => Time.now})
    self[:comments].insert({:owner_id => 2, :text => 'another comment', :created_at => Time.now})
    self[:comments].insert({:owner_id => 2, :text => 'a third comment', :created_at => Time.now})

    self[:item_mentions].insert({:owner_id => 1, :item_id => 2, :comment_id => 1, :created_at => Time.now})
    self[:item_mentions].insert({:owner_id => 1, :item_id => 2, :comment_id => 2, :created_at => Time.now})
    self[:item_mentions].insert({:owner_id => 2, :item_id => 1, :comment_id => 1, :created_at => Time.now})
  end
end
