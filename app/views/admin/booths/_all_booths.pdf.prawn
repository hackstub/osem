prawn_document(force_download: true, filename: "#{@file_name}.pdf", page_layout: :landscape) do |pdf|
  booths_array = []
  header_array = ['Booth ID',
                  'Title',
                  'Description',
                  'DGA',
                  'DRW',
                  'Name',
                  'Email',
                  'Ppls',
                  'Website Url',
                  'Comment',
                  'State']
  booths_array << header_array
  @booths.each do |booth|
    row = []
    row << booth.id
    row << booth.title
    row << booth.description
    row << (booth.during_the_general_audience_weekend ? 'x' : ' ')
    row << (booth.during_the_rest_of_the_week ? 'x' : ' ')
    row << booth.submitter.name
    row << booth.submitter.email.to_s
    row << booth.peoples_on_booth.to_s
    row << booth.website_url
    row << booth.comment
    row << booth.state
    booths_array << row
  end
  pdf.text "#{@conference.short_title} booths", font_size: 25, align: :center
  pdf.table booths_array, header: true, cell_style: {size: 8, border_width: 1},column_widths: [20,60,100,30,30,100,120,30,100,nil,30]
end
