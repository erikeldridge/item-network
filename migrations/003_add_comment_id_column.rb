require 'rubygems'
require 'sequel'

Sequel.migration do

  up do
    alter_table :likes do
      add_column :comment_id, Integer
    end

    self[:likes].insert({:owner_id => 1, :comment_id => 1, :created_at => Time.now})
    self[:likes].insert({:owner_id => 2, :comment_id => 1, :created_at => Time.now})
  end

  down do
    self[:likes].filter({:owner_id => 1, :comment_id => 1}).delete
    self[:likes].filter({:owner_id => 2, :comment_id => 1}).delete

    alter_table :likes do
      drop_column :comment_id
    end
  end
end
