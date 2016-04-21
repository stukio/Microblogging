class UsersController < ApplicationController
  before_action :authenticate_user!, :except => [:reset_password, :show_user_profile, :followers, :following]

  def update_user
   @user = User.find(params[:id])
     if @user.update(user_params)
       head :no_content
     else
       render json: @user.errors, status: :unprocessable_entity
     end
  end

  def show_current_user_profile
      @user = User.find(params[:id])
      render json: @user
  end

  def show_user_profile
    @user = User.find_by(username: params[:username])
    render json: @user
  end

  def my_current_user
    render json: current_user
  end

  def random_users
    @users = User.where.not(id: current_user.id) - current_user.all_following
    render json: @users.sample(5)
  end

  def follow
    user = User.find(params[:user_id])
    @follow = current_user.follow(user)
    render json: @follow
  end

  def unfollow
    user = User.find(params[:user_id])
    @unfollow = current_user.stop_following(user)
    render json: @unfollow
  end

  def followers
    @users = User.find(params[:id]).followers_count
    render json: @users
  end

  def following
    @users = User.find(params[:id]).follow_count
    render json: @users
  end

  def reset_password
    @user = User.find_by_email(params[:user_email])
    @user.send_reset_password_instructions
    render json: @user
  end

  def is_following
   @user = User.find(params[:user_id]).followed_by?(current_user)
   render json: @user
  end
  

  private

    def user_params
      params.require(:user).permit(:username, :avatar, :password)
    end

end