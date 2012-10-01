Sequel::Model.plugin :timestamps
Sequel::Model.plugin :json_serializer

class User < Sequel::Model
end
class Item < Sequel::Model
end
class Like < Sequel::Model
end
