class CreatePosts < ActiveRecord::Migration[5.0]
  def change
    create_table :posts do |t|
      t.string :title
      t.text :body
      t.integer :league_id
      t.integer :team_id
      t.integer :game_id

      t.timestamps
    end
  end
end
