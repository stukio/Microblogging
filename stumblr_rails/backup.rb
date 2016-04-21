class PostsController < ApplicationController
  before_filter :intercept_html_requests
  layout false
  respond_to :json
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  # GET /posts
  # GET /posts.json
  def index
    @posts = Post.all
    render json: @posts
  end

  # GET /posts/1
  # GET /posts/1.json
  
  def show
    render json: @post
  end

  # GET /posts/new
  def new
    @post = Post.new
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts
  # POST /posts.json
  def create
    @post = Post.new(post_params)

    if @post.save
      render json: @post, status: :created
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  def update
    if @post.update(post_params)
      head :no_content
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @post.destroy
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_params
      params.require(:post).permit(:ptype, :title, :content, :psource, :htags, :url, :user_id)
    end

  # if someone asks for html, redirect them to the home page, we only serve json
  def intercept_html_requests
    redirect_to('/') if request.format == Mime::HTML
  end
end
