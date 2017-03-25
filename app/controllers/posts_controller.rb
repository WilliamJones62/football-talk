class PostsController < ApplicationController

  before_action :set_post

  def post_data
    post = post.find(params[:id])
    render json: post.to_json
  end

  def create
    @post = @posts.build(posts_params)
    if @post.save
      render :json => @post
    else
      render json: { errors: "Error creating post, please try again."}
    end
  end

  def index
    render :json => @posts
  end

  def show
    @post = post.find(params[:id])
    if @post
      render json: @post
    else
      render json: { errors: "This is not a post, please try again."}
    end
  end

  def update
    @post = post.find(params[:id])
    if @post.update(posts_params)
      render nothing: true
    else
      render json: { errors: "Error updating post, please try again."}
    end
  end

  def destroy
    @post = post.find(params[:id])
    if @post.destroy
      render nothing: true
    else
      render json: { errors: "Error deleting post, please try again"}
    end
  end

  def data
    post = post.find(params[:id])
    render json: post.to_json(only: [:title, :body])
  end

  private
    def set_post
      @post = Post.find(params[:post_id])
    end

    def posts_params
      params.require(:post).permit(:title, :body, :league_id, :team_id, :game_id)
    end

end
