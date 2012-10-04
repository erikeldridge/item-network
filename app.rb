require 'sinatra'
require 'json'
require 'sequel'

DB = Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://sqlite.db')

require './models'

post '/api/1/item' do
  item = JSON.parse request.body.read
  Item.create(item).to_json
end

put '/api/1/item/:id' do
  item = JSON.parse request.body.read
  Item.where(:id => params[:id]).update(item.to_hash)
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

get '/*' do
  @init_json = {
    :items => Item.all,
    :users => User.all,
    :likes => Like.all
  }.to_json
  erb :default
end
