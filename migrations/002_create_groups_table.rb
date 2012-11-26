require 'rubygems'
require 'sequel'

Sequel.migration do

  up do

    create_table :contributors do
      primary_key :id
      Integer :contributor_id
      Integer :user_id # account being contributed to
      timestamp :created_at
      timestamp :updated_at
    end

    [:items, :comments].each do |table|
      alter_table table do
        add_column :contributor_id, Integer
      end
    end

    self[:contributors].insert({:contributor_id => 1, :user_id => 4, :created_at => Time.now})
    self[:contributors].insert({:contributor_id => 2, :user_id => 4, :created_at => Time.now})
    self[:contributors].insert({:contributor_id => 3, :user_id => 4, :created_at => Time.now})

    self[:comments].insert({:owner_id => 4, :contributor_id => 1, :text => 'contributor comment by 1 for 4', :created_at => Time.now})
    self[:comments].insert({:owner_id => 4, :contributor_id => 2, :text => 'contributor comment about [item-1] by 2 for 4', :created_at => Time.now})
    self[:comments].insert({:owner_id => 4, :contributor_id => 3, :reply_to_id => 8, :text => 'contributor reply (3 to reply 2) by 3 for 4', :created_at => Time.now})
  end

  down do
    drop_table :contributors, :cascade => true

    [:items, :comments].each do |table|
      alter_table table do
        drop_column :contributor_id
      end
    end
  end
end
