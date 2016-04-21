task purge_old_tokens: :environment do
  User.find_each do |user|
    Tiddle.purge_old_tokens(user)
    puts "#{user.email} ===> #{user.authentication_tokens.count}"
    puts ""
  end
  	puts "Success!!"
end