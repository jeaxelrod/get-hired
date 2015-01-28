class CreateJobs < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.integer :user_id,   null: false
      t.integer :queue_id
      t.string :company
      t.string :position
      t.string :link

      t.timestamps null: false
    end

    add_index :jobs, :user_id
    add_index :jobs, :queue_id
  end
end
