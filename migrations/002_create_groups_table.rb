require 'rubygems'
require 'sequel'

Sequel.migration do

  up do

    create_table :groups do
      primary_key :id
      String :name
      Integer :owner_id
      timestamp :created_at
      timestamp :updated_at
    end

    create_table :memberships do
      primary_key :id
      Integer :user_id
      Integer :group_id
      timestamp :created_at
      timestamp :updated_at
    end

    self[:groups].insert({:owner_id => 1, :name => 'Org A', :created_at => Time.now})
    self[:groups].insert({:owner_id => 1, :name => 'Group B', :created_at => Time.now})
    self[:groups].insert({:owner_id => 2, :name => 'Group A', :created_at => Time.now})

    self[:memberships].insert({:user_id => 1, :group_id => 1, :created_at => Time.now})
    self[:memberships].insert({:user_id => 2, :group_id => 1, :created_at => Time.now})
  end

  down do
    drop_table :groups, :memberships, :cascade => true
  end
end
