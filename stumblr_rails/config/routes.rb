Rails.application.routes.draw do

  devise_for :users, :controllers => { :sessions => "sessions", :registrations => "registrations" }
  
  match 'posts/search' => 'posts#search', via: [:get]
  
  match '/random_users' => 'users#random_users', via: [:get]

  match '/my_current_user' => 'users#my_current_user', via: [:get]

  match 'users/:id' => 'users#update_user', via: [:patch]

  match 'users/:id' => 'users#show_current_user_profile', via: [:get]

  match '/users/profile/:username' => 'users#show_user_profile', via: [:get]
   

  get '/follow' => "users#follow"
  get '/unfollow' => "users#unfollow"

  get '/followers/:id'  =>  "users#followers"
  get '/following/:id'  =>  "users#following"

  get '/users/:user_id/is_following' => "users#is_following"

  get '/send_password' => "users#reset_password"


  resources :posts do
    resources :comments
  end



end