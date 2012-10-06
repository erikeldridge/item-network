require 'sinatra'
require 'sinatra/session'
require 'json'
require 'sequel'

DB = Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://sqlite.db')

require './models'

set :session_fail, '/auth'
set :session_secret, 'secret'

post '/api/1/item' do
  session!
  data = JSON.parse request.body.read
  data['owner_id'] = session[:user_id]
  item = Item.create(data)
  Activity.create(:table => 'items', :row => item[:id], :action => 'create', :owner_id => session[:user_id])
  item.to_json
end

put '/api/1/item/:id' do
  session!
  item = JSON.parse request.body.read
  Item.where(:id => params[:id]).update(item.to_hash)
  Activity.create(:table => 'items', :row => params[:id], :action => 'update', :owner_id => session[:user_id])
  item.to_json
end

get '/api/1/search' do
  def empty_param? name
    params[name].nil? || params[name].empty?
  end
  items = Item
  items = items.filter(Sequel.like(:name, "%#{params[:name]}%")) unless empty_param? :name
  items = items.filter(Sequel.like(:state, "%#{params[:state]}%")) unless empty_param? :state
  unless empty_param? :owner
    user_ids = User.select(:id).filter(Sequel.like(:name, "%#{params[:owner]}%"))
    items = items.filter(:owner_id => user_ids)
  end
  unless empty_param? :tag
    item_ids = Tag.select(:item_id).where(:text => params[:tag])
    items = items.filter(:id => item_ids)
  end
  items.to_json
end

get '/api/1/activity' do
  Activity.all.to_json
end

post '/api/1/tag' do
  session!
  data = JSON.parse request.body.read
  data['owner_id'] = session[:user_id]
  tag = Tag.create(data)
  Activity.create(:table => 'tags', :row => tag[:id], :action => 'create', :owner_id => session[:user_id])
  tag.to_json
end

delete '/api/1/tag/:id' do
  session!
  tag = Tag.first(:id => params[:id]).delete
  Activity.create(:table => 'tags', :row => tag[:id], :action => 'delete', :owner_id => session[:user_id])
end

get '/login' do
  session_start!
  session[:user_id] = 1
end

get '/*' do
  @init_json = {
    :items => Item.all,
    :users => User.all,
    :tags => Tag.all
  }.to_json
  erb :default
end
