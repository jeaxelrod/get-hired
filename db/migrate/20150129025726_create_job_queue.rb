class CreateJobQueue < ActiveRecord::Migration
  def change
    create_table :job_queues do |t|
      t.integer :user_id, null: false
      t.datetime :date_active

      t.timestamps null: false
    end
    
    add_index :job_queues, :user_id
  end
end
