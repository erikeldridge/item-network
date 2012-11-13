require 'sinatra'
require 'sinatra/session'
require 'json'
require 'sequel'

DB = Sequel.connect(ENV['HEROKU_POSTGRESQL_RED_URL'] || "postgres://localhost/erik")

require './models'

set :session_fail, '/login'
set :session_secret, 'secret'

def empty_param? name
  params[name].nil? || params[name].empty?
end

post '/api/1/items' do
  session!
  data = JSON.parse request.body.read
  data['owner_id'] = session[:user_id]
  item = Item.create(data)
  Activity.create(:table => 'items', :row => item[:id], :action => 'create', :owner_id => session[:user_id])
  item.to_json
end

put '/api/1/items/:id' do
  session!
  item = JSON.parse request.body.read
  Item.where(:id => params[:id]).update(item.to_hash)
  Activity.create(:table => 'items', :row => params[:id], :action => 'update', :owner_id => session[:user_id])
  item.to_json
end

get '/api/1/items' do
  def empty_param? name
    params[name].nil? || params[name].empty?
  end
  items = Item
  items = items.filter(Sequel.like(:name, "%#{params[:name]}%")) unless empty_param? :name
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

delete '/api/1/items/:id' do
  session!
  Item.where(:id => params[:id]).destroy
  Activity.create(:table => 'items', :row => params[:id], :action => 'delete', :owner_id => session[:user_id])
  200
end

post '/api/1/comments' do
  session!

  data = JSON.parse request.body.read
  data['owner_id'] = session[:user_id]
  comment = Comment.create(data)
  Activity.create(:table => 'comments', :row => comment[:id], :action => 'create', :owner_id => session[:user_id])

  comment[:text].scan(/\[((?:item|user)-\d+)\]/).each do |match|
    data = {
      :comment_id => comment[:id],
      :owner_id => session[:user_id]
    }
    type, id = match.first.split('-')
    data["#{type}_id".to_sym] = id.to_i
    mention = Mention.create(data)
    Activity.create(:table => 'mentions', :row => mention[:id], :action => 'create', :owner_id => session[:user_id])
  end

  comment.to_json
end

get '/api/1/comments' do
  def empty_param? name
    params[name].nil? || params[name].empty?
  end
  comments = Comment
  comments = comments.filter(Sequel.like(:text, "%#{params[:name]}%")) unless empty_param? :name
  comments = comments.filter(:owner_id => params[:owner_id]) unless empty_param? :owner_id
  comments.to_json
end

put '/api/1/comments/:id' do
  session!
  data = JSON.parse request.body.read
  Comment.where(:id => params[:id]).update(data.to_hash)
  Activity.create(:table => 'comments', :row => params[:id], :action => 'update', :owner_id => session[:user_id])
  data.to_json
end

delete '/api/1/comments/:id' do
  session!
  CommentTag.where(:comment_id => params[:id]).destroy
  Comment.where(:id => params[:id]).destroy
  Activity.create(:table => 'comments', :row => params[:id], :action => 'delete', :owner_id => session[:user_id])
  200
end

post '/api/1/item_comments' do
  session!
  data = JSON.parse request.body.read
  data['owner_id'] = session[:user_id]
  record = ItemComment.create(data)
  Activity.create(:table => 'item_comments', :row => record[:id], :action => 'create', :owner_id => session[:user_id])
  record.to_json
end

get '/api/1/item_comments' do
  def empty_param? name
    params[name].nil? || params[name].empty?
  end
  comments = ItemComment
  comments = comments.filter(:owner_id => params[:owner_id]) unless empty_param? :owner_id
  comments.to_json
end

get '/api/1/users' do
  def empty_param? name
    params[name].nil? || params[name].empty?
  end
  users = User
  users = users.filter(Sequel.like(:name, "%#{params[:name]}%")) unless empty_param? :name
  users.to_json
end

put '/api/1/users/:id' do
  session!
  data = JSON.parse request.body.read
  User.where(:id => params[:id]).update(data.to_hash)
  Activity.create(:table => 'users', :row => params[:id], :action => 'update', :owner_id => session[:user_id])
  data.to_json
end

get '/api/1/activities' do
  session!
  activities = Activity
  unless empty_param? :owner_id
    activities = activities.filter(:owner_id => session[:user_id])
  else
    user_ids = Like.select(:user_id).filter(:owner_id => session[:user_id])
    activities = activities.filter(:owner_id => user_ids)
  end
  activities.to_json
end

post '/api/1/comment_tags' do
  session!
  data = JSON.parse request.body.read
  data['owner_id'] = session[:user_id]
  tag = CommentTag.create(data)
  Activity.create(:table => 'comment_tags', :row => tag[:id], :action => 'create', :owner_id => session[:user_id])
  tag.to_json
end

get '/api/1/comment_tags' do
  def empty_param? name
    params[name].nil? || params[name].empty?
  end
  rows = CommentTag
  rows = rows.filter(Sequel.like(:text, "%#{params[:text]}%")) unless empty_param? :text
  rows = rows.filter(:comment_id => params[:comment_id]) unless empty_param? :comment_id
  rows.to_json
end

post '/api/1/mentions' do
  session!
  data = JSON.parse request.body.read
  data['owner_id'] = session[:user_id]
  tag = ItemMention.create(data)
  Activity.create(:table => 'mentions', :row => tag[:id], :action => 'create', :owner_id => session[:user_id])
  tag.to_json
end

delete '/api/1/mentions/:id' do
  session!
  tag = ItemMention.first(:id => params[:id]).delete
  Activity.create(:table => 'mentions', :row => tag[:id], :action => 'delete', :owner_id => session[:user_id])
end

post '/api/1/likes' do
  session!
  data = JSON.parse request.body.read
  data['owner_id'] = session[:user_id]
  record = Like.create(data)
  Activity.create(:table => 'likes', :row => record[:id], :action => 'create', :owner_id => session[:user_id])
  record.to_json
end

get '/login' do
  session_start!
  session[:user_id] = 1
  200
end

get '/*' do
  user_ids = Like.select(:user_id).filter(:owner_id => session[:user_id])
  activities = Activity.filter(:owner_id => user_ids)
  @init_json = {
    :current_user => session,
    :items => Item.all,
    :users => User.all,
    :contributors => Contributor.all,
    :mentions => Mention.all,
    :comment_tags => CommentTag.all,
    :comments => Comment.all,
    :activities => activities.all,
    :bookmarks => Bookmark.all,
    :likes => Like.filter(:owner_id=>session[:user_id])
  }.to_json
  erb :default
end
