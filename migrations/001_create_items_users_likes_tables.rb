require 'rubygems'
require 'sequel'

Sequel.migration do
  change do

    create_table :items do
      primary_key :id
      String :name
      Integer :owner_id
      timestamp :created_at
      timestamp :updated_at
    end

    create_table :comments do
      primary_key :id
      String :text
      Integer :item_id
      Integer :user_id
      Integer :reply_to_id
      Integer :owner_id
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
      Integer :comment_id
      Integer :item_id
      Integer :owner_id
      timestamp :created_at
      timestamp :updated_at
    end

    create_table :comment_tags do
      primary_key :id
      String :text
      foreign_key :comment_id, :comments, :key => :id
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
      Integer :owner_id
      timestamp :created_at
      timestamp :updated_at
    end

    create_table :bookmarks do
      primary_key :id
      String :name
      String :url
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

    # status
    self[:comments].insert({:owner_id => 1, :text => 'status 1', :created_at => Time.now})
    self[:comments].insert({:owner_id => 2, :text => 'status 2', :created_at => Time.now})
    self[:comments].insert({:owner_id => 2, :text => 'status 3', :created_at => Time.now})

    # comments
    self[:comments].insert({:owner_id => 1, :item_id => 1, :text => 'comment 1 about item 1', :created_at => Time.now})
    self[:comments].insert({:owner_id => 1, :item_id => 1, :text => 'comment 2 about item 1', :created_at => Time.now})
    self[:comments].insert({:owner_id => 2, :item_id => 2, :text => 'comment 3 about item 2', :created_at => Time.now})

    # replies
    self[:comments].insert({:owner_id => 1, :reply_to_id => 4, :text => 'reply 1 to comment 1', :created_at => Time.now})
    self[:comments].insert({:owner_id => 2, :reply_to_id => 7, :text => 'reply 2 to reply 1', :created_at => Time.now})
    self[:comments].insert({:owner_id => 3, :reply_to_id => 8, :text => 'reply 3 to reply 2', :created_at => Time.now})

    # activity
    self[:activities].insert(:table => 'comments', :row => 7, :action => 'create', :owner_id => 1)
    self[:activities].insert(:table => 'comments', :row => 8, :action => 'create', :owner_id => 2)
    self[:activities].insert(:table => 'comments', :row => 9, :action => 'create', :owner_id => 3)

    # bookmarks
    self[:bookmarks].insert(:name => 'Home', :url => '/')
    self[:bookmarks].insert(:name => 'All items', :url => '/items')
    self[:bookmarks].insert(:name => 'All users', :url => '/users')
    self[:bookmarks].insert(:name => 'Create item', :url => '/create')

    self[:comment_tags].insert({:owner_id => 1, :text => 'asd', :comment_id => 1, :created_at => Time.now})
    self[:comment_tags].insert({:owner_id => 1, :text => 'asd', :comment_id => 2, :created_at => Time.now})
    self[:comment_tags].insert({:owner_id => 1, :text => 'qwe', :comment_id => 2, :created_at => Time.now})
    self[:comment_tags].insert({:owner_id => 2, :text => 'qwe', :comment_id => 3, :created_at => Time.now})

    self[:item_mentions].insert({:owner_id => 1, :item_id => 2, :comment_id => 1, :created_at => Time.now})
    self[:item_mentions].insert({:owner_id => 1, :item_id => 2, :comment_id => 2, :created_at => Time.now})
    self[:item_mentions].insert({:owner_id => 2, :item_id => 1, :comment_id => 1, :created_at => Time.now})
  end
end
