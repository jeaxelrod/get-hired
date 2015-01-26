class CreateQueues < ActiveRecord::Migration
  def change
    create_table :queues do |t|
      t.integer :user_id
      t.datetime :date_active

      t.timestamps null: false
    end
  end
end
