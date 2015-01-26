class CreateApplications < ActiveRecord::Migration
  def change
    create_table :applications do |t|
      t.integer :job_id
      t.datetime :date_applied
      t.text :comments
      t.text :communication
      t.string :status

      t.timestamps null: false
    end
  end
end
