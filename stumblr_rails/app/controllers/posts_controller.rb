class PostsController < ApplicationController
  before_action :authenticate_user!, :except => [:search]
  before_filter :intercept_html_requests

  # GET /posts.json
  def index
    @posts = current_user.followed_users_posts
    render json: @posts
  end

  # POST /posts.json
  def create
    @post = current_user.posts.build(post_params)

      if @post.save
          render json: @post, status: :created
      else
          render json: @post.errors, status: :unprocessable_entity
      end 
  end

  # GET posts/search
  def search
    # isto é a parte do search ---> em vez de pesquisa exacta devia ser "contém" search term.
    if params[:query]
      @posts = Post.search_posts(params[:query])
    # isto dá-me todos os posts cujo user_id é x;
    elsif params[:user_id]
      @posts = Post.search_users(params[:user_id])
    end
    render json: @posts
  end

  # PATCH /posts/1.json
  def update
    @post = Post.find(params[:id])
    if @post.update(post_params)
      head :no_content
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/1.json
  def destroy
    @post = Post.find(params[:id])   
    @post.destroy
    render :nothing => true
  end


  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_params
      params.require(:post).permit(:ptype, :title, :content, :psource, :htags, :url, :user_id)
    end

    # if someone asks for html, redirect them to the home page, we only serve json
    def intercept_html_requests
      redirect_to('/#/dashboard/erro') if request.format == Mime::HTML
    end


end




