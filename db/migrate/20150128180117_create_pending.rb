class CreatePending < ActiveRecord::Migration
  def change
    create_table :pendings do |t|
      t.integer :user_id, null: false
      t.datetime :date_active

      t.timestamps null: false
    end

    add_index :pendings, :user_id
  end
end
