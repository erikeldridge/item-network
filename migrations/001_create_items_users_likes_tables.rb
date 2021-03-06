require 'rubygems'
require 'sequel'
require 'scrypt'

Sequel.migration do

  up do

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
      String :password_hash
      String :email
      timestamp :created_at
      timestamp :updated_at
    end

    create_table :mentions do
      primary_key :id
      Integer :comment_id
      Integer :item_id
      Integer :user_id
      Integer :owner_id
      timestamp :created_at
      timestamp :updated_at
    end

    create_table :likes do
      primary_key :id
      Integer :user_id
      Integer :item_id
      Integer :owner_id
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
      Integer :owner_id
      timestamp :created_at
      timestamp :updated_at
    end

    # users
    password = SCrypt::Password.create("asd123")
    (1..4).each do |i|
      self[:users].insert({:name => "user#{i}", :password_hash => password, :email => "user#{i}@example.com", :created_at => Time.now})
    end

    self[:items].insert({:owner_id => 1, :name => 'item1', :created_at => Time.now})
    self[:items].insert({:owner_id => 2, :name => 'item2', :created_at => Time.now})
    self[:items].insert({:owner_id => 3, :name => 'item3', :created_at => Time.now})

    self[:likes].insert({:owner_id => 1, :user_id => 2, :created_at => Time.now})
    self[:likes].insert({:owner_id => 1, :item_id => 2, :created_at => Time.now})

    # status
    self[:comments].insert({:owner_id => 1, :text => 'status 1', :created_at => Time.now})
    self[:comments].insert({:owner_id => 2, :text => 'status 2', :created_at => Time.now})
    self[:comments].insert({:owner_id => 2, :text => 'status 3', :created_at => Time.now})

    # comments
    self[:comments].insert({:owner_id => 1, :item_id => 1, :text => 'comment 1 about [item-1]', :created_at => Time.now})
    self[:comments].insert({:owner_id => 1, :item_id => 1, :text => 'comment 2 about [item-1]', :created_at => Time.now})
    self[:comments].insert({:owner_id => 2, :item_id => 2, :text => 'comment 3 about [user-2]', :created_at => Time.now})

    # replies
    self[:comments].insert({:owner_id => 1, :reply_to_id => 4, :text => 'reply 1 to comment 4', :created_at => Time.now})
    self[:comments].insert({:owner_id => 2, :reply_to_id => 7, :text => 'reply 2 to reply 1', :created_at => Time.now})
    self[:comments].insert({:owner_id => 3, :reply_to_id => 8, :text => 'reply 3 to reply 2', :created_at => Time.now})

    # activity
    self[:activities].insert(:table => 'comments', :row => 7, :action => 'create', :owner_id => 1)
    self[:activities].insert(:table => 'comments', :row => 8, :action => 'create', :owner_id => 2)
    self[:activities].insert(:table => 'comments', :row => 9, :action => 'create', :owner_id => 3)

    # bookmarks
    (1..3).each do |i|
      self[:bookmarks].insert(:name => 'Home', :url => '/', :owner_id => i, :created_at => Time.now)
      self[:bookmarks].insert(:name => 'All items', :url => '/items', :owner_id => i, :created_at => Time.now)
      self[:bookmarks].insert(:name => 'All users', :url => '/users', :owner_id => i, :created_at => Time.now)
      self[:bookmarks].insert(:name => 'Create item', :url => '/create', :owner_id => i, :created_at => Time.now)
      self[:bookmarks].insert(:name => 'Logout', :url => '/logout', :owner_id => i, :created_at => Time.now)
    end

    self[:mentions].insert({:owner_id => 1, :item_id => 1, :comment_id => 4, :created_at => Time.now})
    self[:mentions].insert({:owner_id => 1, :item_id => 1, :comment_id => 5, :created_at => Time.now})
    self[:mentions].insert({:owner_id => 2, :user_id => 2, :comment_id => 6, :created_at => Time.now})
  end

  down do
    drop_table :items, :likes, :comment_tags, :comments, :users, :mentions, :activities, :bookmarks, :cascade => true
  end
end
