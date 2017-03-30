Rails.application.routes.draw do
  resources :posts
  root 'application#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  devise_for :users, controllers: { :omniauth_callbacks => "users/omniauth_callbacks" }
  get '/users/sign_out', to: 'application#home'
end
