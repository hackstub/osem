class RmllBoothsForm < ActiveRecord::Migration[5.0]
  def change
    change_table :booths do |t|
      t.boolean  "during_the_general_audience_weekend", default: false
      t.boolean  "during_the_rest_of_the_week", default: false
      t.boolean  "assurance", default: false
      t.integer  "peoples_on_booth", default: 1
      t.text     "hardware_needs"
      t.text     "comment"
    end
  end
end
