class AddAvatarToUsers < ActiveRecord::Migration
  def change
    add_column :users, :avatar, :string, :default => "http://discovermagazine.com/~/media/import/images/b/e/b/chimpmedia.jpg?mw=300"
  end
end