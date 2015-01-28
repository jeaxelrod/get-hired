class CreateQueues < ActiveRecord::Migration
  def change
    create_table :queues do |t|
      t.integer :user_id, null: false
      t.datetime :date_active

      t.timestamps null: false
    end
    add_index :queues, :user_id
  end
end
