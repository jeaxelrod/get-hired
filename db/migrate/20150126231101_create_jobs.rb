class CreateJobs < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.integer :user_id
      t.integer :queue_id
      t.string :company
      t.string :position
      t.string :link

      t.timestamps null: false
    end
  end
end
