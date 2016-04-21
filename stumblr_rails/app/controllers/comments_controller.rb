class CommentsController < ApplicationController
  before_action :authenticate_user!, :except => [:index]

 def index
  @comments = Post.find(params[:post_id]).comments
  render json: @comments
 end

 def create
    @post = Post.find(params[:post_id])
    @comment = @post.comments.build(comment_params)
    @comment.user = current_user
    @comment.username = current_user.username
      
      if @comment.save    
		    render json: @comment
      else
		    render json: @comment.errors, status: :unprocessable_entity
      end
   
  end

  def destroy
    @post = Post.find(params[:post_id])
    @comment = @post.comments.find(params[:id]).destroy
    render json: @comment
  end

  private

    def comment_params
      params.require(:comment).permit(:content)
    end

end