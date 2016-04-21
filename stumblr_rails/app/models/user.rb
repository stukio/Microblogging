class User < ActiveRecord::Base

  validates_presence_of :username
  validates_uniqueness_of :username
  
  # Follow gem
  acts_as_followable
  acts_as_follower
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :token_authenticatable
  
  has_many :authentication_tokens
  has_many :posts, :dependent => :destroy
  has_many :comments, :through => :posts


  def followed_users_posts
		users = self.all_following
		
    my_posts = Array.new
		
    users.each do |u|
			 u.posts.each do |p|
          my_posts.push(p)
       end
		end

    self.posts.each do |p|
      my_posts.push(p)
    end

		return my_posts

  end
  

  # def followed_users_posts

  #    if self.following_users.empty?
        
  #       posts = Array.new
  #       self.posts.each do |p|
  #         posts.push(p)
  #       end

  #    else 
      
  #       posts = self.following_users.collect{ |u| u.posts }
  #       posts = posts.first.all

  #       self.posts.each do |p|
  #         posts.push(p)
  #       end

  #    end
  
  #       return posts

  # end

end
