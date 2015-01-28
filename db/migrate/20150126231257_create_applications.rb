class CreateApplications < ActiveRecord::Migration
  def change
    create_table :applications do |t|
      t.integer :job_id,   null: false
      t.datetime :date_applied
      t.text :comments
      t.text :communication
      t.string :status

      t.timestamps null: false
    end

    add_index :applications, :job_id
  end
end
