class Post < ActiveRecord::Base
  belongs_to :user
  has_many :comments, :dependent => :destroy


  def self.search_posts(arg)
    user = User.find_by(username: arg)
    
    if user
      posts = user.posts + Post.where('(htags LIKE ?) OR (title LIKE ?) OR (content LIKE ?)', "%#{arg}%", "%#{arg}%", "%#{arg}%")
    else
  	  posts = Post.where('(htags LIKE ?) OR (title LIKE ?) OR (content LIKE ?)', "%#{arg}%", "%#{arg}%", "%#{arg}%")
    end
      return posts.uniq
      
  end

  def self.search_users(arg)
  	posts = Post.where("user_id = :id", { id: arg })
  	return posts
  end





end