class TranslateConference < ActiveRecord::Migration[5.0]
  def change
    reversible do |dir|
      dir.up do
        Conference.create_translation_table!({
          :title => :string,
          :description => :text
        }, {
          :migrate_data => true,
          :remove_source_columns => true
        })
      end

      dir.down do
        Conference.drop_translation_table! :migrate_data => true
      end
    end
  end
end
