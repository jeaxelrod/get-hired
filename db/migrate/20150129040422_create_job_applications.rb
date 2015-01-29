class CreateJobApplications < ActiveRecord::Migration
  def change
    create_table :job_applications do |t|
      t.integer :job_id,   null: false
      t.integer :user_id,  null: false
      t.datetime :date_applied
      t.text :comments
      t.text :communication
      t.string :status

      t.timestamps null: false
    end

    add_index :job_applications, :job_id
    add_index :job_applications, :user_id
  end
end
