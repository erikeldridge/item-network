Sequel::Model.plugin :timestamps
Sequel::Model.plugin :json_serializer

class User < Sequel::Model
end
class Group < Sequel::Model
end
class Membership < Sequel::Model
end
class Item < Sequel::Model
end
class Mention < Sequel::Model
end
class Activity < Sequel::Model
end
class Comment < Sequel::Model
end
class Like < Sequel::Model
end
class CommentTag < Sequel::Model
end
class Bookmark < Sequel::Model
end
