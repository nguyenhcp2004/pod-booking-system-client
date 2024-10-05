import http from '~/utils/http';
import { AmenityListResType } from '~/schemaValidations/amenity.schema';

const amenityApiRequest = {
  getAllAmenities: () => {
    return http.get<AmenityListResType>('/amenity');
  },
};

export default amenityApiRequest;
