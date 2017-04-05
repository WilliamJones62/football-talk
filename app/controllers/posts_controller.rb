class PostsController < ApplicationController

  before_action :set_post, only: [ :show, :update, :destroy ]
  before_action :signed_in?, only: [:create, :update, :destroy]
  before_action :authorize_user!, only: [:update, :destroy]

  def home
  end

  def create
    if @signed_in
      @post = Post.new(posts_params)
      @post.user_id = current_user.id
      if @post.save
        render :json => @post
      else
        render json: { errors: "Error creating post, please try again."}
      end
    else
      render json: { errors: "Access denied. Sign In."}
    end
  end

  def index
    @posts = Post.where("league_id = ? AND team_id = ? AND game_id = ?", params[:league_id], params[:team_id], params[:game_id])
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
    if @signed_in and @authorized
      if @post.update(posts_params)
        render nothing: true
      else
        render json: { errors: "Error updating post, please try again."}
      end
    else
      render json: { errors: "Access denied."}
    end
  end

  def destroy
    if @signed_in and @authorized
      if @post.destroy
        render nothing: true
      else
        render json: { errors: "Error deleting post, please try again"}
      end
    else
      render json: { errors: "Access denied."}
    end
  end

  private
    def set_post
      @post = Post.find(params[:id])
    end

    def posts_params
      params.require(:post).permit(:title, :body, :league_id, :team_id, :game_id)
    end

    def signed_in?
      @signed_in = true
      unless current_user
        @signed_in = false
      end
    end

    def authorize_user!
      @authorized = true
      unless current_user.id == @post.user_id || current_user.admin?
        @authorized = false
      end
    end

end
