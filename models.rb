Sequel::Model.plugin :timestamps
Sequel::Model.plugin :json_serializer

class User < Sequel::Model
end
class Item < Sequel::Model
end
class CommentTag < Sequel::Model
end
class Activity < Sequel::Model
end
class Comment < Sequel::Model
end
class UserLike < Sequel::Model
end
