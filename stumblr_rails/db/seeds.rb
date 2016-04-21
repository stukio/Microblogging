(1..10).each_with_index do |u, index|
	user = User.create! :username => 'Unknown' + index.to_s, :email => index.to_s + '@gmail.com', :password => 'password', :password_confirmation => 'password'
end