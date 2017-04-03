class PostsController < ApplicationController

  before_action :set_post, only: [ :show, :update, :destroy ]
  before_action :signed_in?, only: [:new, :edit, :update, :destroy]
  before_action :authorize_user!, only: [:edit, :update, :destroy]

  def home
  end

  def create
    @post = Post.new(posts_params)
    @post.user_id = current_user.id
    if @post.save
      render :json => @post
    else
      render json: { errors: "Error creating post, please try again."}
    end
  end

  def index
    @posts = Post.all
    render :json => @posts
  end

  def show
    if @post
      render json: @post
    else
      render json: { errors: "This is not a post, please try again."}
    end
  end

  def update
    if @post.update(posts_params)
      render nothing: true
    else
      render json: { errors: "Error updating post, please try again."}
    end
  end

  def destroy
    if @post.destroy
      render nothing: true
    else
      render json: { errors: "Error deleting post, please try again"}
    end
  end

  private
    def set_post
      @post = Post.find(params[:post_id])
    end

    def posts_params
      params.require(:post).permit(:title, :body, :league_id, :team_id, :game_id)
    end

    def signed_in?
      unless current_user
        redirect_to posts_path, :alert => "Access denied."
      end
    end

    def authorize_user!
      unless current_user.id == @post.user_id || current_user.admin?
        redirect_to post_path(id: @post.id), :alert => "Access denied."
      end
    end

end
