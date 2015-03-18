class CreateContacts < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.integer :job_application_id
      t.integer :user_id
      t.integer :job_id
      t.string :first_name
      t.string :last_name
      t.string :email
      t.integer :phone_number

      t.timestamps
    end

    add_index :contacts, :job_application_id
    add_index :contacts, :user_id
    add_index :contacts, :job_id
  end
end
