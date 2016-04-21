class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string  :ptype
      t.string  :title
      t.text    :content
      t.string  :psource
      t.string  :url
      t.string  :htags
      t.integer :user_id

      t.timestamps null: false
    end
  end
end